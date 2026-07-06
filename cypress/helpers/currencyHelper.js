class CurrencyHelper {

    static toNumber(value) {

        return Number(

            value
                .replace(/[^\d,]/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()

        )

    }

}

export default CurrencyHelper