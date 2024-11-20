import { Client } from "@elastic/elasticsearch";
import serverConfig from "./server.config.js";

class Elasticsearch {
  static instance = null;

  constructor() {
    if (!Elasticsearch.instance) {
      this.client = new Client({ node: serverConfig.elasticsearch.uri });
      Elasticsearch.instance = this;
    }

    return Elasticsearch.instance;
  }

  getClient() {
    return this.client;
  }
}

const es = new Elasticsearch();
export const esClient = es.getClient();
