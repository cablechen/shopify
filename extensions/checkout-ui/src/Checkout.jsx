import {
  BlockStack,
  reactExtension,
  Text,
  Link,
  Image,
  TextBlock,
  useApi,
} from '@shopify/ui-extensions-react/checkout';
import {useEffect, useState} from 'react';
import { getOrder,coinpalApi } from "./utils";


// 1. Choose an extension target
export default reactExtension(
    'purchase.thank-you.block.render',
    () => <Extension />,
);

function Extension() {
  // 2. Use the extension API to gather context from the checkout and shop
  const {orderConfirmation,selectedPaymentOptions,query} = useApi();
  // 安全访问订单号
  const orderNumber = orderConfirmation?.current?.number || "Loading...";
  const identityId = orderConfirmation?.current?.order?.id || "Unknown";
  const orderId = identityId.replace('Identity', '')
  const [data, setData] = useState();
  useEffect(() => {
    query(
        `query ($first: Int!) {
        products(first: $first) {
          nodes {
            id
            title
          }
        }
      }`,
        {
          variables: {first: 5},
        },
    )
        .then(({data, errors}) => setData(data))
        .catch(console.error);
  }, [query]);
  console.log('--------------------------->',data);

  // const orderData = getOrder(orderId);
  // console.log("订单信息:", JSON.stringify(orderData, null, 2));



  const orderData2 =  coinpalApi(orderData);
  console.log("coinpal:", JSON.stringify(orderData2, null, 2));


  // 3. Render a UI
  console.log(orderConfirmation.current);
  console.log(selectedPaymentOptions.current);
  // 安全访问支付方式类型
  const paymentMethodType = selectedPaymentOptions?.current?.[0]?.type || "Unknown";
  const paymentMethodHandle = selectedPaymentOptions?.current?.[0]?.handle || "N/A";
  const paymentUrl = `https://pay.coinpal.io?redirect=${orderId}`;
  const isCoinpalPayment = paymentMethodType === "creditCard";

  return (
      <BlockStack>
        <Text>订单显示编号1: {orderNumber}</Text>
        <Text>订单唯一ID: {orderId}</Text>
        <Text>支付方式类型: {paymentMethodType}</Text>
        <TextBlock>支付方式标识: {paymentMethodHandle}</TextBlock>
        {isCoinpalPayment && (
            <Link size="extraLarge" to={paymentUrl}>
              <Image source="https://www.coinpal.io/components/footer/img/logo-icon.png" />
            </Link>
        )}
      </BlockStack>
  );
}