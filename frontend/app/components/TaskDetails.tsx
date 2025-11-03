import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'



export default function TaskDetails() {

    const task = useLocalSearchParams()
    const { id, title, description, deadline, userStatus } = task

    const [assignedTo, setAssignedTo] = useState<string[]>([])

    const fetchAssignedUsers = async () => {
        const response = await fetch(`http://localhost:4000/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        setAssignedTo(data)
    }

    useEffect(() => {
        fetchAssignedUsers()
    }, [])

    const handleEdit = () => {
        router.push({
            pathname: '../components/EditTask',
            params: {
                id, title, description, deadline, assignedTo, userStatus
            }
        })
    }

    const handleClose = async () => {

    }

    return (
        <View style={styles.card}>
            <View style={styles.head}>
                <Text style={styles.title}>{title}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Pressable
                        onPress={handleEdit}
                    >
                        <Ionicons name="create" size={24} color="black" />
                    </Pressable>
                    <Pressable
                        onPress={handleClose}
                    >
                        <Ionicons name="close" size={24} color="red" />
                    </Pressable>
                </View>

            </View>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Deadline:</Text>
                <Text style={styles.value}>{deadline}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Assigned To:</Text>
                <View style={styles.assignedList}>
                    {assignedTo.map((user, index) => (
                        <Text key={index} style={styles.assignedUser}>
                            {user}
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles.status} >
                <Ionicons name="ellipse" size={24} color={userStatus === 'INPROGRESS' ? 'orange' : "lightgreen"} />
                <Text style={styles.userStatus}>{userStatus === 'INPROGRESS' ? 'In Progress...' : 'Completed'}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        margin: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    label: {
        fontWeight: 'bold',
        color: '#444',
        marginRight: 6,
    },
    value: {
        color: '#555',
        flexShrink: 1,
    },
    assignedList: {
        flex: 1,
        flexDirection: 'row',
        gap: 5,
        flexWrap: 'wrap'
    },
    assignedUser: {
        color: '#007AFF',
        marginBottom: 2,
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end'
    },
    userStatus: {
        fontSize: 15,
        fontWeight: 'bold',
        fontStyle: 'italic'
    }
});