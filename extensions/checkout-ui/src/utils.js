export async function updateIssues(id, newIssues) {
    // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.
    return await makeGraphQLQuery(
        `mutation SetMetafield($namespace: String!, $ownerId: ID!, $key: String!, $type: String!, $value: String!) {
    metafieldDefinitionCreate(
      definition: {namespace: $namespace, key: $key, name: "Tracked Issues", ownerType: PRODUCT, type: $type, access: {admin: MERCHANT_READ_WRITE}}
    ) {
      createdDefinition {
        id
      }
    }
    metafieldsSet(metafields: [{ownerId:$ownerId, namespace:$namespace, key:$key, type:$type, value:$value}]) {
      userErrors {
        field
        message
        code
      }
    }
  }
  `,
        {
            ownerId: id,
            namespace: "$app:issues",
            key: "issues",
            type: "json",
            value: JSON.stringify(newIssues),
        }
    );
}

export async function getIssues(productId) {
    // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.
    return await makeGraphQLQuery(
        `query Product($id: ID!) {
      product(id: $id) {
        metafield(namespace: "$app:issues", key:"issues") {
          value
        }
        variants(first: 2) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `,
        { id: productId }
    );
}

async function makeGraphQLQuery(query, variables) {
    const graphQLQuery = {
        query,
        variables,
    };
    const url = 'https://coinpal-test.myshopify.com/admin/api/2025-01/graphql.json';
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token":  process.env.SHOPIFY_API_KEY,
        },
        body: JSON.stringify(graphQLQuery),
    });

    if (!res.ok) {
        console.error("Network error");
    }

    return await res.json();
}

// export async function getOrder(orderId) {
//     return await makeGraphQLQuery(
//         `query OrderQuery($id: ID!) {
//           order(id: $id) {
//             id
//             name
//             createdAt
//             totalPriceSet {
//               shopMoney {
//                 amount
//                 currencyCode
//               }
//             }
//             customer {
//               id
//               displayName
//               email
//             }
//             lineItems(first: 5) {
//               edges {
//                 node {
//                   title
//                   quantity
//                   priceSet {
//                     shopMoney {
//                       amount
//                       currencyCode
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }`,
//         { id: orderId }
//     );
// }


// export async function getOrder(orderId) {
//     return await makeGraphQLQuery(
//         `query OrderQuery($id: ID!) {
//           order(id: $id) {
//             id
//             name
//             createdAt
//             processedAt
//             totalPriceSet {
//               shopMoney {
//                 amount
//                 currencyCode
//               }
//             }
//             subtotalPriceSet {
//               shopMoney {
//                 amount
//                 currencyCode
//               }
//             }
//             discountApplications(first: 5) {
//               edges {
//                 node {
//                   targetType
//                   value {
//                     __typename
//                     ... on MoneyV2 {
//                       amount
//                       currencyCode
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }`,
//         { id: orderId }
//     );
// }

// export async function getOrder(orderId) {
//     return await makeGraphQLQuery(
//         `query getOrderDetails($id: ID!) {
//           order(id: $id) {
//             id
//             name
//             createdAt
//             processedAt
//             totalPriceSet {
//               shopMoney {
//                 amount
//                 currencyCode
//               }
//             }
//             subtotalPriceSet {
//               shopMoney {
//                 amount
//                 currencyCode
//               }
//             }
//             discountApplications(first: 5) {
//               edges {
//                 node {
//                   targetType
//                   value {
//                     __typename
//                     ... on MoneyV2 {
//                       amount
//                       currencyCode
//                     }
//                   }
//                 }
//               }
//             }
//             shop {
//                 name
//                 primaryDomain {
//                   url
//                 }
//                 currencyCode
//                 country
//             }
//           }
//         }`,
//         { id: orderId }
//     );
// }

export async function getOrder(orderId) {
    const orderQuery = `
        query ($id: ID!) {
          order(id: $id) {
            id
            name
            referrerUrl
            totalPrice
            currencyCode
            statusPageUrl
            paymentGatewayNames
            displayFinancialStatus
            displayFulfillmentStatus
            transactions {
              status
            }
            createdAt
            processedAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            subtotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }`;



    return  await makeGraphQLQuery(orderQuery, { id: orderId });

}



// export async function getUrl(orderId) {
//     return await makeGraphQLQuery(
//         `query getOrderStatusUrl($id: ID!) {
//   order(id: $id) {
//     id
//     name
//     legacyResourceId
//   }
// }`,
//         { id: orderId }
//     );
// }

// export async function getUrl(orderId) {
//     return await makeGraphQLQuery(
//         `query getOrderStatusUrl($id: ID!) {
//             order(id: $id) {
//                 id
//                 orderStatusUrl
//                 createdAt
//                 totalPriceV2 {
//                     amount
//                     currencyCode
//                 }
//                 customer {
//                     firstName
//                     lastName
//                     email
//                 }
//                 shop {
//                     name
//                     primaryDomain {
//                       url
//                     }
//                     currencyCode
//                     country
//                 }
//             }
//         }`,
//         { id: orderId }
//     );
// }

export async function coinpalApi(requestBody) {
    try {
        // const requestBody = {
        //     amount: 100,
        //     currency: "USD",
        //     description: "Test payment",
        //     customerId: "12345",
        //     returnUrl: "https://your-shopify-store.com/thank-you",
        // };
        const response = await fetch(" https://pay-dev.coinpal.io/gateway/shopify/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data from external API");
        }

        const data = await response.json();
        console.log("外部 API 数据:", data);
        return data;
    } catch (error) {
        console.error("调用外部 API 失败:", error);
    }
}


