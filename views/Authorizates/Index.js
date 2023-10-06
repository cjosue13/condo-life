import * as React from 'react';
import {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import colors from '../../styles/colors';
import Previous from './Previous';
import Permanents from './Permanents';
import Services from './Services';
import Temps from './Temps';

export default function TabViewScene({navigation}) {
  const layout = useWindowDimensions();

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <Permanents navigation={navigation} title={'Permanente'} />;
      case 'second':
        return <Temps navigation={navigation} title={'Temporal'} />;
      case 'third':
        return <Services navigation={navigation} title={'Servicios'} />;
      case 'fourth':
        return <Previous navigation={navigation} title={route.title} />;
      default:
        return null;
    }
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Permanentes'},
    {key: 'second', title: 'Temporales'},
    {key: 'third', title: 'Servicios'},
    {key: 'fourth', title: 'Historial'},
  ]);

  const renderTab = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: colors.white}}
        style={{backgroundColor: colors.secondary}}
        scrollEnabled
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
