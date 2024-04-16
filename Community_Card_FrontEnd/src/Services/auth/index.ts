import axios from 'axios';

export const register_me = async (formData: any, elevation: number) => {

    try {
        formData.address.elevation = elevation;
        let endpoint = formData.isSeller ? "/seller/addSeller" : "/customer/addCustomer";
        console.log(formData);
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, JSON.stringify(formData),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return res;
    } catch (error) {
        throw new Error('error in register (service) => ' + error);
    }
}

export const upload_profile_photo = async (photo: File, email: string, isSeller: boolean) => {

    try {
        var photoFormData = new FormData();
        photoFormData.append('profilePhoto', photo);

        let endpoint = isSeller ? 'seller/uploadPhoto/profile' : 'customer/uploadPhoto/profile';
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
            photoFormData,
            {
                params: {
                    email: email,
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

        return res;
    } catch (error) {
        throw new Error('error in register (service) => ' + error);
    }
}

export const login_me = async (formData: any) => {

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/authenticate`, JSON.stringify(formData), {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return res;
    } catch (error) {
        throw new Error('error in login (service) => ' + error);
    }
}

export const forget_password = async (email: string) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgotPassword`, {
            params: { email }
        })

        return res;
    } catch (error) {
        throw new Error('error in forget Password (service) => ' + error);
    }
}

export const change_password = async (formData: any) => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/changePassword`, JSON.stringify(formData),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })

        return res;
    } catch (error) {
        throw new Error('error in forget Password (service) => ' + error);
    }
}

