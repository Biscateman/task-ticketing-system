import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

type Task = {
    id: string,
    title: string,
    description: string,
    deadline: string,
    assignedTo?: string[],
    userStatus?: string
}

type TaskProp = {
    task: Task
}

const Task = ({ task }: TaskProp) => {


    return (
        <Pressable onPress={() => {
            router.push({
                pathname: '../components/TaskDetails',
                params: {
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline,
                    id: task.id,
                    userStatus: task.userStatus
                }
            })
        }}>
            <View style={styles.container}>
                <Text>{task.title}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'cyan',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 10,
        borderColor: 'pink',
        borderWidth: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 600
    }
})

export default Task