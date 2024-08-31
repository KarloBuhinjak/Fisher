import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FishList from "./screens/FishList";
import FishDetails from "./screens/FishDetails";
import AddFish from "./screens/AddFish";
import UpdateFish from "./screens/UpdateForm";
import Login from "./screens/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

const InsideLayout = ({ route }) => {
  const { user } = route.params;

  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Fish List">
        {(props) => <FishList {...props} user={user} />}
      </InsideStack.Screen>
      <InsideStack.Screen name="Fish Details" component={FishDetails} />
      <InsideStack.Screen name="Add Fish">
        {(props) => <AddFish {...props} user={user} />}
      </InsideStack.Screen>
      <InsideStack.Screen name="Update Fish" component={UpdateFish} />
    </InsideStack.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="InsideLayout"
            options={{ headerShown: false }}
            component={InsideLayout}
            initialParams={{ user }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
