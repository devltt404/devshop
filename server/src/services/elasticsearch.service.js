import mongoose from "mongoose";
import { esClient } from "../configs/elasticsearch.config.js";
import { PRODUCT_FACET_FIELD, PRODUCT_SORT_FIELD } from "../constants/index.js";
import CategoryService from "./category.service.js";

export class ElasticsearchService {
  static async searchProducts({
    key,
    page = 1,
    limit = 10,
    sortBy,
    categoryId,
    minRating,
    minPrice,
    maxPrice,
    order,
    facet: facetKey,
    catFacet,
  }) {
    // ------ Sort ------
    const sort = [
      {
        numSold: { order: "desc" },
      },
    ];

    if (sortBy) {
      sort.unshift({
        [PRODUCT_SORT_FIELD[sortBy]]: { order: order || "asc" },
      });
    }

    // ------ Filter ------
    const mustFilters = [];
    if (key) {
      // mustFilters.push({
      //   bool: {
      //     should: [
      //       { match: { name: { query: key, boost: 3 } } },
      //       // {
      //       //   match: {
      //       //     description: { query: key, fuzziness: "AUTO", boost: 1.5 },
      //       //   },
      //       // },
      //     ],
      //   },
      // });

      mustFilters.push({
        multi_match: {
          query: key,
          fields: ["name^3", "description"],
          fuzziness: "AUTO",
          operator: "and",
        },
      });

      sort.unshift({
        _score: { order: "desc" },
      });
    }

    if (categoryId) {
      const categoryIds = await CategoryService.getDescendantIds(categoryId);
      if (categoryIds.length > 0)
        mustFilters.push({ terms: { category: categoryIds } });
    }

    if (minRating)
      mustFilters.push({ range: { avgRating: { gte: minRating } } });

    if (minPrice || maxPrice) {
      const rangeFilter = {};
      if (minPrice)
        rangeFilter.minPrice = {
          gte: minPrice,
        };
      if (maxPrice)
        rangeFilter.maxPrice = {
          lte: maxPrice,
        };
      mustFilters.push({ range: rangeFilter });
    }

    let facetField = PRODUCT_FACET_FIELD[facetKey];
    let searchQuery = {
      index: "products",
      _source: "_id",
      from: (page - 1) * limit,
      size: limit,
      body: {
        query: {
          bool: {
            must: mustFilters,
          },
        },
        sort,
      },
    };

    // ------ Facets ------
    if (facetField) {
      searchQuery.body.aggs = {
        [facetField]: {
          terms: { field: facetField, size: 5 },
        },
      };
    }

    // ------ Post-filter for catFacet ------
    if (catFacet) {
      searchQuery.body.post_filter = {
        terms: {
          category: catFacet.split(","),
        },
      };
    }

    const searchResult = await esClient.search(searchQuery);
    const { hits, aggregations } = searchResult.body;

    const result = {
      totalProducts: hits.total.value,
      productIds: hits.hits.map((hit) => new mongoose.Types.ObjectId(hit._id)),
      facets: aggregations,
    };

    return result;
  }
}
