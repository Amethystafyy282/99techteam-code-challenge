// interface WalletBalance {
//   currency: string; // TODO: might need a currencyID to use as key since currency sometime might get duplicated
//   amount: number;
// }
// interface FormattedWalletBalance { // TODO: Should extends from WalletBalance
//   currency: string;
//   amount: number;
//   formatted: string;
// }
//
// interface Props extends BoxProps {} // TODO: should use only BoxProps if there is no other props needed
// const WalletPage: React.FC<Props> = (props: Props) => {
//   const { children, ...rest } = props; // TODO: dangerous use of rest prop, un-necessary children prop
//   const balances = useWalletBalances(); // TODO: use value directly like this is non-sense because its always initiated, should use an object to indiate when we can fetch the data
//   const prices = usePrices();
//   // TODO: processing data function should have put this into hooks
//   const getPriority = (blockchain: any): number => { // TODO: should have use useCallback and define a type for input blockchain
//     switch (blockchain) {
//       case "Osmosis":
//         return 100;
//       case "Ethereum":
//         return 50;
//       case "Arbitrum":
//         return 30;
//       case "Zilliqa":
//         return 20; // TODO: Can remove this line because they're return the same value
//       case "Neo":
//         return 20;
//       default:
//         return -99;
//     }
//   };
//
//   const sortedBalances = useMemo(() => {
//     return balances // TODO: sortedBalances should only contains sorted balances, use filter in a different variable
//       .filter((balance: WalletBalance) => {
//         const balancePriority = getPriority(balance.blockchain);
//         if (lhsPriority > -99) { // TODO: too many conditions, un-necessary checking because priority is always biggest than -99
//           if (balance.amount <= 0) { // TODO: amount <= 0 is un-realistic
//             return true;
//           }
//         }
//         return false;
//       })
//       .sort((lhs: WalletBalance, rhs: WalletBalance) => {
//         const leftPriority = getPriority(lhs.blockchain); // TODO: lhs.blockchain doesnt exist in Interface
//         const rightPriority = getPriority(rhs.blockchain); // TODO: even blockchain is correct, it should be rename to leftBlockChain and rightBlockChain
//         if (leftPriority > rightPriority) {
//           return -1;
//         } else if (rightPriority > leftPriority) {
//           return 1;
//         } // TODO: lack of handling equal value, or simply do `return leftPriority - rightPriority`
//       });
//   }, [balances, prices]);
//

//    // TODO: should use useMemo for un-necessary re-render after component re-render
//    // TODO: use a function here only to calculate fixedAmount is un-necessary, can do it below inside the component
//   const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
//     return {
//       ...balance,
//       formatted: balance.amount.toFixed(), // TODO: naming: should be fixedAmount
//     };
//   });
//
//   // TODO: a simple map data like this should use directly in the HTML's code below to prevent un-necessary computing
//   const rows = sortedBalances.map(
//     (balance: FormattedWalletBalance, index: number) => {
//       const usdValue = prices[balance.currency] * balance.amount; // TODO: should use a function to get prices based on currency to prevent protype accessing
//       return (
//         <WalletRow
//           className={classes.row} // TODO: classes.row doesnt exist in component's prop, but classes.row shouldn't comes from parent component either, it makes harder for maintain and debug.
//           key={index} // TODO: use Index as key might get render un-correctly for un-static component
//           amount={balance.amount}
//           usdValue={usdValue} // TODO: should calculate usdValue inside WalletRow
//           formattedAmount={balance.formatted}
//            // TODO: lack of balance.currency value prop, at first I though you wont need it, but you still need balance.amount so I figured you would need balance.currency
//         />
//       );
//     },
//   );
//
//   return <div {...rest}>{rows}</div>; // TODO: dangerous `rest` props, should have define it specifically for each prop to prevent un-necessary props that contributed as bugs
// };

export {};
