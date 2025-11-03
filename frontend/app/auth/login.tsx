import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { useContext, useState } from 'react';
import { router } from 'expo-router';
import { AuthContext } from '../utils/authContext';
import * as SecureStore from "expo-secure-store";
import axios from "axios";


type Error = {
    email?: string,
    password?: string,
    invalid?: string
}

const LoginScreen = async () => {

    const { isLoggedIn, setIsLoggedIn, token, setToken, userRole, setUserRole } = useContext(AuthContext);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<Error>({})
    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        let errors: Error = {}

        if (!email) errors.email = 'Email is required'
        if (!password) errors.password = 'Password is required'

        setErrors(errors)

        return Object.keys(errors).length === 0
    }


    const handleSubmit = async () => {
        setLoading(true)
        if (validateForm()) {
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            if (!response.ok) {
                const errorData = await response.json()
                setErrors({ invalid: errorData.message })
            } else {

                const data = await response.json()

                await SecureStore.setItemAsync("accessToken", data.accessToken);
                await SecureStore.setItemAsync("refreshToken", data.refreshToken);

                setIsLoggedIn(true)
                setToken(data.updatedUser.token)
                setUserRole(data.updatedUser.role)


                const api = axios.create({ baseURL: 'http://localhost:4000' });

                api.interceptors.request.use(async (config) => {
                    const accessToken = await SecureStore.getItemAsync("accessToken");
                    if (accessToken) {
                        config.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return config;
                },
                    (error) => {
                        return Promise.reject(error);
                    }
                );


                api.interceptors.response.use(response => response,
                    async (error) => {
                        const originalRequest = error.config;
                        if (error.response.status === 401 && !originalRequest._retry) {
                            originalRequest._retry = true;
                            const refreshToken = await SecureStore.getItemAsync("refreshToken");
                            const response = await api.post('/auth/refresh-token', { token: refreshToken });
                            if (response.status === 200) {
                                const newAccessToken = response.data.accessToken;
                                await SecureStore.setItemAsync("accessToken", newAccessToken);
                                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                                return api(originalRequest);
                            }
                        }
                        return Promise.reject(error);
                    }
                );

                alert(`Login successful!`)
                router.replace(data.updatedUser.role === 'admin' ? '/admin/tasks' : '/admin/tasks')
            }

        }
        setLoading(false)
    }

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 400 : 0} style={styles.container}>
            <View style={styles.form} >
                <Text style={styles.label} >Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your email'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                {errors.invalid ? <Text style={styles.errorText}>{errors.invalid}</Text> : null}

                <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleSubmit} disabled={loading} />
                <Text></Text>
                <Button title='Signup' onPress={() => router.push('./register')} />
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    form: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    }
});

export default LoginScreen