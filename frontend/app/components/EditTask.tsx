import { Button, Platform, StyleSheet, Text, TextInput, KeyboardAvoidingView, View } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import AssignUsersInput from './AssignUsers'
import { Checkbox } from 'react-native-paper';


type Task = {
    id: string,
    title: string,
    description: string,
    deadline: string,
    assignedTo: string,
    userStatus?: string
}


const EditTask = () => {
    const [allUsers, setAllUsers] = useState<string[]>([])

    const [includeSelf, setIncludeSelf] = useState(false);



    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/users')
            const data = await response.json()
            setAllUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
            return []
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const task: Task = useLocalSearchParams()

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [deadline, setDeadline] = useState(task.deadline)
    const [assignedTo, setAssignedTo] = useState(task.assignedTo.split(','))

    const toggleSelf = () => {
        setIncludeSelf(!includeSelf)
        if (true) {
            setAssignedTo([...assignedTo,])
        } else {
            // Remove current user from assigned users
        }
    };
    // const oldTask = {
    //     title: task.title,
    //     description: task.description,
    //     deadline: task.deadline,
    //     assignedTo: task.assignedTo
    // }

    const handleAddTask = async () => {

    }

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 400 : 0} style={styles.container}>
            <View style={styles.form} >
                <Text style={styles.label} >Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your title'
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize='none'
                />
                {/* {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null} */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your description'
                    value={description}
                    onChangeText={setDescription}
                    autoCapitalize='none'
                />

                <Text style={styles.label}>Deadline</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your deadline'
                    value={deadline}
                    onChangeText={setDeadline}
                    autoCapitalize='none'
                />

                <Text style={styles.label}>Assign to Users</Text>

                <AssignUsersInput allUsers={allUsers} assignedUsers={assignedTo} />

                <Checkbox
                    status={includeSelf ? 'checked' : 'unchecked'}
                    onPress={toggleSelf}
                />

                <Button title='Finish Editing' onPress={handleAddTask} />
            </View>
        </KeyboardAvoidingView>
    )
}

export default EditTask

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