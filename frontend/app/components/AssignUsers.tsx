import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

type UserListProps = {
    allUsers: string[];
    assignedUsers: string[];
}


export default function AssignUsersInput({ allUsers, assignedUsers }: UserListProps) {

    const [query, setQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>(assignedUsers);

    const filteredUsers = allUsers.filter(
        (user) => user.toLowerCase().includes(query.toLowerCase()) && !selectedUsers.includes(user)
    );

    const addUser = (user: string) => {
        setSelectedUsers([...selectedUsers, user]);
        setQuery('');
    };

    const removeUser = (user: string) => {
        setSelectedUsers(selectedUsers.filter((u) => u !== user));
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                {selectedUsers.map((user) => (
                    <View key={user} style={styles.chip}>
                        <Text style={styles.chipText}>{user}</Text>
                        <TouchableOpacity onPress={() => removeUser(user)}>
                            <Text style={styles.chipRemove}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TextInput
                    style={styles.input}
                    placeholder="Assign users..."
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {filteredUsers.length > 0 && (
                <FlatList
                    style={styles.dropdown}
                    data={filteredUsers}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => addUser(item)} style={styles.dropdownItem}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 12 },
    inputWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        padding: 6,
        backgroundColor: '#F5F5F5',
    },
    input: { flex: 1, minWidth: 100, fontSize: 16 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        margin: 4,
    },
    chipText: { color: '#fff', marginRight: 6 },
    chipRemove: { color: '#fff', fontWeight: 'bold' },
    dropdown: { borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 10, marginTop: 4, backgroundColor: '#fff' },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
});
