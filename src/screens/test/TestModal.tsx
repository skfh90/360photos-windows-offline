import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from "react-native";

import Modal from "react-native-modal";

const TestModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Show modal" onPress={toggleModal} />
      <Modal isVisible={isModalVisible}>
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            placeholder="Type something"
            value={text}
            onChangeText={setText}
          />
        </KeyboardAvoidingView>
        <Button title="Hide modal" onPress={toggleModal} />
      </Modal>
    </View>
  );
};

export default TestModal;
