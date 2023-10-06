import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';
import Votes from '../../../views/Votes/Votes';
import DetailsVotes from '../../../views/Votes/DetailsVotes';
import NewVoter from '../../../views/Votes/NewVoter';
import Results from '../../../views/Votes/Results';
import DetailsResults from '../../../views/Votes/DetailsResults';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import {Platform, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {havePermissions} from '../../../utils/auth';
import authContext from '../../../context/autentication/authContext';

const Stack = createStackNavigator();

const VotesStack = ({navigation}) => {
  const auth = useContext(authContext);
  const {user} = auth;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.header,
        headerTitleStyle: {
          fontFamily: configFonts.default.medium.fontFamily,
          fontWeight: Platform.select({ios: 'bold', android: undefined}),
          fontSize: RFValue(12),
        },
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="votes"
        options={{
          title: 'Votaciones',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              {!havePermissions(['voter'], user.roles) && (
                <>
                  <IconButton
                    size={RFValue(25)}
                    color={colors.white}
                    onPress={() => navigation.navigate('results')}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name="chart-bar"
                        size={size}
                        color={color}
                        backgroundColor={theme.colors.primary}
                      />
                    )}
                  />
                  <IconButton
                    size={RFValue(25)}
                    color={colors.white}
                    onPress={() => navigation.navigate('menu')}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name="home-circle"
                        size={size}
                        color={color}
                        backgroundColor={theme.colors.primary}
                      />
                    )}
                  />
                </>
              )}
            </View>
          ),
        }}
        component={Votes}
      />

      <Stack.Screen
        name="detailsVotes"
        options={{
          title: 'Preguntas de votación',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              {!havePermissions(['voter'], user.roles) && (
                <>
                  <IconButton
                    size={RFValue(25)}
                    color={colors.white}
                    onPress={() => navigation.navigate('menu')}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name="home-circle"
                        size={size}
                        color={color}
                        backgroundColor={theme.colors.primary}
                      />
                    )}
                  />
                </>
              )}
            </View>
          ),
        }}
        component={DetailsVotes}
      />
      <Stack.Screen
        name="newVoter"
        options={{
          title: 'Nuevo votante',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('menu')}
                icon={({size, color}) => (
                  <View style={globalStyles.rowDirection}>
                    {!havePermissions(['voter'], user.roles) && (
                      <>
                        <IconButton
                          size={RFValue(25)}
                          color={colors.white}
                          onPress={() => navigation.navigate('menu')}
                          icon={({size, color}) => (
                            <MaterialCommunityIcons
                              name="home-circle"
                              size={size}
                              color={color}
                              backgroundColor={theme.colors.primary}
                            />
                          )}
                        />
                      </>
                    )}
                  </View>
                )}
              />
            </View>
          ),
        }}
        component={NewVoter}
      />
      <Stack.Screen
        name="results"
        options={{
          title: 'Lista de resultados',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              {!havePermissions(['voter'], user.roles) && (
                <>
                  <IconButton
                    size={RFValue(25)}
                    color={colors.white}
                    onPress={() => navigation.navigate('menu')}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name="home-circle"
                        size={size}
                        color={color}
                        backgroundColor={theme.colors.primary}
                      />
                    )}
                  />
                </>
              )}
            </View>
          ),
        }}
        component={Results}
      />
      <Stack.Screen
        name="detailsResults"
        options={{
          title: 'Resumen',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              {!havePermissions(['voter'], user.roles) && (
                <>
                  <IconButton
                    size={RFValue(25)}
                    color={colors.white}
                    onPress={() => navigation.navigate('menu')}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name="home-circle"
                        size={size}
                        color={color}
                        backgroundColor={theme.colors.primary}
                      />
                    )}
                  />
                </>
              )}
            </View>
          ),
        }}
        component={DetailsResults}
      />
    </Stack.Navigator>
  );
};

export default VotesStack;
