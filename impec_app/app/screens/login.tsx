import React from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "../form/Button";
import { InputGroup } from "../form/InputGroup";


interface CreateAccountProps {}

export const Signup: React.FunctionComponent<CreateAccountProps> =
  ({}) => {
    const signup = () => {
      console.log("Create account here...");
    };

    const [firstName, setFirstName] = React.useState("");

    return (
      <ScrollView
        style={{flex:1}}
        contentContainerStyle={{padding:4}}
      >
        <Text style={{marginTop:2}}>
          Création de compte
        </Text>
        <InputGroup
          label="Préom"
          value={firstName}
          placeholder="Marie"
          onChangeText={setFirstName}
        />
        <InputGroup
          label="Nom"
          value={firstName}
          placeholder="Berry"
          onChangeText={setFirstName}
        />
        <InputGroup
          label="Email"
          value={firstName}
          placeholder="marie.berry@mail.com"
          onChangeText={setFirstName}
          type="email-address"
        />
        <InputGroup
          label="Mot de passe"
          value={firstName}
          onChangeText={setFirstName}
          password
        />
        <InputGroup
          label="Confirmation de mot de passe"
          value={firstName}
          onChangeText={setFirstName}
          password
        />
        <View style={{flexGrow:1}} />
        <Button onPress={signup}>Créer mon compte</Button>
      </ScrollView>
    );
  };