import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

type dataResponse = {
  UnitPrice: number;
  Description: string;
  Quantity: number;
  Country: string;
  InvoiceNo: string;
  InvoiceDate: Date;
  CustomerID: number;
  StockCode: string;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async search(query) {
    let results = new Set();
    const response = await this.esService.search({
        "index": 'location',
        "size": 10,
        "query": {
        "bool": 
        {
            "should": 
            [
                {
                    "match_phrase_prefix": 
                    {
                        "city": 
                        {
                            "query": query
                        }
                    }
                },
                {
                    "match_phrase_prefix": 
                    {
                        "state": 
                        {
                            "query": query
                        }
                    }
                }
            
            ]
        }
    },
        "aggs" : 
        {
            "group_by_city" : 
            {
                "terms" : { "field" : "city.keyword","size":15,"order":{ "_key": "asc" } }
            }
        }   
    });
    return response
  }

  async search_city(query){
      const results = this.esService.search(
        {
          "size": 100,
          "query": {
            "match": {
              "state": query
            }
          },
          "aggs" : {
              "group_by_city" : {
                  "terms" : { "field" : "city.keyword","size":15,"order":{ "_key": "asc" } }
              }
          }
        }
      )
    return results
  }

  async search_zipcode(query){
    const results = this.esService.search(
      {
        "size": 100,
        "query": {
          "match_phrase_prefix": {
            "zipcode": query
          }
        },
        "aggs" : {
            "group_by_zipcode" : {
                "terms" : { "field" : "zipcode.keyword","size":15,"order":{ "_key": "asc" } }
            }
        }
      }
    )
  return results
}
async search_city_state(city,state) {
  let results = new Set();
  const response = await this.esService.search
  ({
      "size": 10,
      "query": {
      "bool": 
      {
          "must": 
          [
              {
                  "match_phrase_prefix": 
                  {
                      "city": 
                      {
                          "query": city
                      }
                  }
              },
              {
                  "match_phrase_prefix": 
                  {
                      "state": 
                      {
                          "query": state
                      }
                  }
              }
          
          ]
      }
  }
  });
  return response
}
}