import axios from 'axios';

export const get_customer = async (customerId: number) => {

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/getCustomer`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: { customerId }
            }
        );

        return res;
    } catch (error) {
        throw new Error('error in getting customer (service) => ' + error);
    }
}
