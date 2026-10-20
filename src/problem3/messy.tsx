interface WalletBalance {
    currency: string;
    amount: number;
}
// ANTI-PATTERN: FormattedWalletBalance re-declares every WalletBalance field instead of extending it.
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

// ANTI-PATTERN: An empty interface that only re-exports BoxProps; a type alias (or BoxProps itself) is enough.
// ANTI-PATTERN: Also wrapped it with PropsWithChildren since children is being destructured.
interface Props extends BoxProps {

}
// ANTI-PATTERN: `React.FC<Props>` already types `props`, so `(props: Props)` is redundant.
const WalletPage: React.FC<Props> = (props: Props) => {
    // ANTI-PATTERN: `children` is destructured but never used.
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // INEFFICIENCY: getPriority does not use props or state, yet it is re-created on every render.
    //               Define it once outside the component. Inside, it is also a hidden useMemo dependency.
    // ANTI-PATTERN: `blockchain: any` throws away type safety.
    // ANTI-PATTERN: The magic number -99 is repeated in the filter instead of being a named constant.
    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            // ANTI-PATTERN: Duplicated branches; Zilliqa and Neo can fall through to one `return 20`.
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                // INEFFICIENCY: Make a variable to store this value with a naming.
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        // INEFFICIENCY: destructure balance into { blockchain, amount }
        return balances.filter((balance: WalletBalance) => {
            // ANTI-PATTERN: balancePriority is not being used.
            const balancePriority = getPriority(balance.blockchain);
            // ANTI-PATTERN: Nested ifs that return true/false instead of one boolean expression.
            if (lhsPriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            // INEFFICIENCY: getPriority runs twice per comparison
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
            // ANTI-PATTERN: The comparator returns undefined for equal priorities instead of 0.
            //               `rightPriority - leftPriority` is shorter and covers every case.
        });
    // INEFFICIENCY: `prices` is not used inside this memo
    }, [balances, prices]);

    // INEFFICIENCY: formattedBalances is built on every render but never used
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    // INEFFICIENCY: rows are not memoized
    // ANTI-PATTERN: The annotation says FormattedWalletBalance but the items are WalletBalance.
    //               The wrong annotation hides that `formatted` is missing.
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                // ANTI-PATTERN: Using the array index as a key. When the list is re-sorted or filtered, React
                //               reuses the wrong rows, causing extra re-renders and stale state.
                //               Use a stable id such as blockchain + currency.
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        // ANTI-PATTERN: Might have attributes leak to the DOM as invalid.
        <div {...rest}>
            {rows}
        </div>
    )
}
