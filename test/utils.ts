export function assertRelation<T, U>(): TypeRelationAsserter<T, U> {
    const isSame: any = () => {
        /* noop */
    };
    return { isSame };
}

interface TypeRelationAsserter<T, U> {
    isSame: true extends IsSame<T, U> ? () => void : "T and U are not the same";
}

type IsSame<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
