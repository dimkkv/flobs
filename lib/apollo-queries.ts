import { gql } from '@apollo/client';

export const apolloQueries = {
  bot: (botName: string = 'Flashloan Detector') => {
    return {
      query: gql`
        query exampleQuery($input: BotsInput) {
          bots(input: $input) {
            bots {
              chainIds
              createdAt
              description
              developer
              docReference
              enabled
              id
              image
              name
              reference
              repository
              projects
              scanNodes
              version
            }
          }
        }
      `,
      variables: {
        input: {
          name: botName,
        },
      },
    };
  },
  recentAlertsFromFlashLoanDetector: (
    afer_blocknumber?: string,
    after_alertId?: string
  ) => {
    const botIds: string[] = [
      '0x55636f5577694c83b84b0687eb77863850c50bd9f6072686c8463a0cbc5566e0',
    ];
    let vars = {
      input: {
        first: 1000,
        bots: botIds,
        blockSortDirection: 'desc',
      },
    };

    if (afer_blocknumber && after_alertId) {
      vars.input['after'] = {
        blockNumber: afer_blocknumber,
        alertId: after_alertId,
      };
    }

    return {
      query: gql`
        query recentAlerts($input: AlertsInput) {
          alerts(input: $input) {
            pageInfo {
              hasNextPage
              endCursor {
                alertId
                blockNumber
              }
            }
            alerts {
              createdAt
              name
              protocol
              findingType
              source {
                transactionHash
                block {
                  number
                  chainId
                }
                bot {
                  id
                }
              }
              severity
              metadata
              scanNodeCount
            }
          }
        }
      `,
      variables: vars,
    };
  },
};
