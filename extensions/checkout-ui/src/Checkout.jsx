import {
  BlockStack,
  reactExtension,
  Text,
  Link,
  Image,
  TextBlock,
  useApi,
} from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension(
    'purchase.thank-you.block.render',
    () => <Extension />,
);

function Extension() {
  // 2. Use the extension API to gather context from the checkout and shop
  const {orderConfirmation,selectedPaymentOptions} = useApi();
  // 安全访问订单号
  const orderNumber = orderConfirmation?.current?.number || "Loading...";
  const orderId = orderConfirmation?.current?.order?.id || "Unknown";
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
