import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';

const SignupScreen = () => {

    type Error = {
        name?: string,
        role?: string,
        username?: string,
        password?: string
    }

    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<Error>({})
    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        let errors: Error = {}

        if (!email) errors.username = 'Email is required'
        if (!password) errors.password = 'Password is required'
        if (!name) errors.name = 'Name is required'
        if (!role) errors.role = 'Role is required'

        setErrors(errors)

        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        setLoading(true)

        if (validateForm()) {

            const response = await fetch('http://localhost:4000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, role, email, password })
            })
            if (!response.ok) {
                const errorData = await response.json()
                setErrors({ username: errorData.message })
            } else {
                alert('Registration successful! Please log in.')
                setName('')
                setRole('')
                setEmail('')
                setPassword('')
                setErrors({})
            }
        }
        setLoading(false)
    }

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 400 : 0} style={styles.container}>
            <View style={styles.form} >
                <Text style={styles.label} >Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your name'
                    value={name}
                    onChangeText={setName}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                <Text style={styles.label} >Role</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your role: User/Admin'
                    value={role}
                    onChangeText={setRole}
                    autoCapitalize='none'
                />
                {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}

                <Text style={styles.label} >Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your Email'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />
                {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <Button title={loading ? 'Signing up ...' : 'Signup'} onPress={handleSubmit} disabled={loading} />
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


export default SignupScreen