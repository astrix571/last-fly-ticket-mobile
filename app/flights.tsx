const renderItem = ({ item }: { item: FlightItem }) => {
  const price =
    item?.price?.amount ??
    item?.price ??
    item?.totalPrice ??
    item?.fare ?? "—";

  const currency =
    item?.price?.currency ??
    item?.currency ?? "USD";

  const from =
    item?.route?.[0]?.cityFrom ??
    item?.from?.city ??
    item?.sourceCity ??
    item?.from ?? "—";

  const to =
    item?.route?.[0]?.cityTo ??
    item?.to?.city ??
    item?.destinationCity ??
    item?.to ?? "—";

  const depart =
    item?.route?.[0]?.local_departure ??
    item?.outbound?.departure ??
    item?.departure ??
    "";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{from} → {to}</Text>
      <Text style={styles.line}>Departure: {depart || "—"}</Text>
      <Text style={styles.line}>Price: {price} {currency}</Text>
    </View>
  );
};
