class CalculationHelper {

    static subtotal(price, quantity) {

        return Number((price * quantity).toFixed(2))

    }

}

export default CalculationHelper