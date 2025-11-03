import { StyleSheet, View, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import Task from '../components/Task'


type TaskType = {
    id: string
    title: string,
    description: string,
    deadline: string,
    assignedTo: string[]
}

export default function Tasks() {

    const [tasks, setTasks] = useState<TaskType[]>([])

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:4000/tasks')
            const data = await response.json()
            setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={({ item }) => <Task task={item} />}
                style={styles.container}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#44c446ff',
        flex: 1
    }
})