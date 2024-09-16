import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Search from '../../screens/Search/Search';

export type SearchStackParams = {
  Signin: {};
  Search: {};
  Appointement: {};
};

const SearchStack = createNativeStackNavigator<SearchStackParams>();

export const SearchScreenStack = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Group>
        <SearchStack.Screen
          options={{
            headerShown: false,
          }}
          name="Search"
          component={Search}
        />
      </SearchStack.Group>
    </SearchStack.Navigator>
  );
};
