import { LicensePlateInput } from '../../components/LicensePlateInput';
import { Container, Content } from './styles';
import { Header } from '../../components/Header';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { useRef, useState } from 'react';
import { Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

import { useRealm } from '../../libs/realm';
import { useUser } from '@realm/react'
import { Historic } from '../../libs/realm/schemas/Historic';


import { useNavigation } from '@react-navigation/native';


const keyBoardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position';

export function Departure() {
  const {goBack} = useNavigation()
  const realm = useRealm()
  const user = useUser()

  const [licensePlate, setLicencePlate] = useState('')
  const [description, setDescription] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)


  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert('Placa Invalida', 'Por favor insira uma placa valida.')
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo.')
      }

      setIsRegistering(true)

      // realm.write(() => {
      //   realm.create('Historic', Historic.generate({
      //     user_id: user!.id,
      //     license_plate: licensePlate.toUpperCase(),
      //     description: description
      //   }))
      // })

      realm.write(() => {
        realm.create('Historic', Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate,
          description,
        }))
      });

      Alert.alert('Saída', 'Saída do Veículo registrada com sucesso!');
      
      goBack();
    } catch(error){
      console.log(error);
      Alert.alert('Erro', 'Não foi possível registrar esse veículo.')
    }

    }

  return (
      <Container>
        <Header title='Saída' />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyBoardAvoidingViewBehavior}>
          <ScrollView>
            <Content>
              <LicensePlateInput
                ref={licensePlateRef}
                label='Placa do veículo'
                placeholder="BRA1234"
                onSubmitEditing={() => descriptionRef.current?.focus()}
                returnKeyType="next"
                onChangeText={setLicencePlate}
              />

              <TextAreaInput
                ref={descriptionRef}
                label='Finalidade'
                placeholder='Vou utilizar o veículo para...'
                onSubmitEditing={handleDepartureRegister}
                returnKeyType='send'
                blurOnSubmit
                onChangeText={setDescription}

              />

              <Button
                title="Registrar Saída"
                onPress={handleDepartureRegister}
                isLoading={isRegistering}
              />
            </Content>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
  }