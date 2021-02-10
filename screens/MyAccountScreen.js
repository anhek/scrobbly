import React, { useState } from 'react';
import { Image, View, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/authActions';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../components/UI/CustomText';
import LinkItem from '../components/LinkItem';

import myColors from '../constants/myColors';
import spacing from '../constants/spacing';
import useColorScheme from '../hooks/useColorSchemeFix';

const MyAccountScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const isDarkTheme = useColorScheme() === 'dark' ? true : false;
  const { userData } = route.params;
  const [result, setResult] = useState(null);

  const signOutHandler = async () => {
    dispatch(authActions.logOut());
  };

  const _handlePressButtonAsync = async (page) => {
    let result;
    switch (page) {
      case 'terms':
        result = await WebBrowser.openBrowserAsync(
          'https://scrobbly.netlify.app/terms-and-conditions'
        );
        setResult(result);
        break;
      case 'privacy':
        result = await WebBrowser.openBrowserAsync(
          'https://scrobbly.netlify.app/privacy-policy'
        );
        setResult(result);
        break;

      default:
        break;
    }
  };

  const _handleSendFeedback = async () => {
    const sendFeedbackEmail =
      'mailto:scrobbly.app@gmail.com?subject=Scrobbly Feedback:';
    Linking.openURL(sendFeedbackEmail);
  };

  return (
    <ScrollView
      style={{
        backgroundColor: isDarkTheme ? myColors.gray_1100 : myColors.gray_100,
      }}
    >
      <View>
        {userData ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing.lg,
              backgroundColor: isDarkTheme ? myColors.gray_1050 : 'white',
              borderBottomWidth: 1,
              borderBottomColor: isDarkTheme
                ? myColors.gray_950
                : myColors.gray_200,
              marginBottom: 40,
            }}
          >
            <Image
              source={{ uri: userData.image }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
              }}
            />
            <View
              style={{
                flex: 1,
                marginLeft: spacing.lg,
              }}
            >
              <CustomText
                children={userData.name}
                size="H3"
                bold
                color={isDarkTheme ? 'white' : myColors.gray_900}
                complementaryStyle={{ marginBottom: 4 }}
              />
              <CustomText
                children={userData.playcount + ' scrobbles'}
                size="H6"
                color={isDarkTheme ? myColors.gray_500 : myColors.gray_600}
              />
            </View>
          </View>
        ) : null}

        <View
          style={{
            marginBottom: 40,
            borderTopWidth: 1,
            borderTopColor: isDarkTheme ? myColors.gray_950 : myColors.gray_100,
          }}
        >
          <LinkItem
            onPress={() => {
              navigation.navigate('About this version');
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={isDarkTheme ? myColors.gray_200 : myColors.gray_900}
              style={{ marginRight: 5 }}
            />
            <CustomText size="H6">About this version</CustomText>
          </LinkItem>
          <LinkItem onPress={() => _handlePressButtonAsync('terms')}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={isDarkTheme ? myColors.gray_200 : myColors.gray_900}
              style={{ marginRight: 5 }}
            />
            <CustomText size="H6">Terms & Conditions</CustomText>
          </LinkItem>
          <LinkItem onPress={() => _handlePressButtonAsync('privacy')}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={isDarkTheme ? myColors.gray_200 : myColors.gray_900}
              style={{ marginRight: 5 }}
            />
            <CustomText size="H6">Privacy Policy</CustomText>
          </LinkItem>
          <LinkItem onPress={_handleSendFeedback}>
            <Ionicons
              name="mail-outline"
              size={24}
              color={isDarkTheme ? myColors.gray_200 : myColors.gray_900}
              style={{ marginRight: 5 }}
            />
            <CustomText size="H6">Send us feedback</CustomText>
          </LinkItem>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: isDarkTheme ? myColors.gray_950 : myColors.gray_100,
          }}
        >
          <LinkItem onPress={signOutHandler} type="signout">
            <Ionicons
              name="log-out-outline"
              size={24}
              color={myColors.primary}
              style={{ marginRight: 5 }}
            />
            <CustomText size="H6" color={myColors.primary}>
              Sign Out
            </CustomText>
          </LinkItem>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyAccountScreen;
