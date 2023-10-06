import * as React from 'react';
import {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import colors from '../../styles/colors';
import Bookings from './Bookings';
import History from './History';

export default function TabViewScene({navigation}) {
  const layout = useWindowDimensions();

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'first':
        return (
          <Bookings
            navigation={navigation}
            title={route.title}
            jumpTo={jumpTo}
          />
        );
      case 'second':
        return (
          <History
            navigation={navigation}
            title={route.title}
            jumpTo={jumpTo}
            lazy
          />
        );

      default:
        return null;
    }
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Reservas'},
    {key: 'second', title: 'Historial'},
  ]);

  const renderTab = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: colors.white}}
        style={{backgroundColor: colors.secondary}}
      />
    );
  };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTab}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width, backgroundColor: colors.primary}}
    />
  );
}
