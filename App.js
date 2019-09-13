import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/es/integration/react"
import { Platform, StatusBar, View } from "react-native"
import { AppLoading, Notifications } from "expo"
import * as Font from "expo-font"
import { Asset } from "expo-asset"
import { Feather } from "@expo/vector-icons"
import { NotificationChannels } from "./constants/notificationsConstants"
import configureStore from "./configureStore"
import RootNavigation from "./navigation/RootNavigation"
import Styles from "./styles/Containers"
import AnalyticsManager from "./lib/AnalyticsManager"
import Colors from './constants/Colors'
import ErrorManager from "./lib/ErrorManager"

const { persistor, store } = configureStore

ErrorManager.initialise()

class App extends Component {
  static propTypes = {
    skipLoadingScreen: PropTypes.bool,
  }

  static defaultProps = {
    skipLoadingScreen: false,
  }

  static getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return App.getActiveRouteName(route)
    }
    return route.routeName
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoadingComplete: false,
      store: {
        persistor,
        store,
      },
    }
  }

  componentDidMount() {
    if (Platform.OS === `android`) {
      Object.keys(NotificationChannels).forEach((key) => {
        const channel = NotificationChannels[key]
        Notifications.createChannelAndroidAsync(channel.id, channel.options)
      })
    }
    this.notificationSubscription = Notifications.addListener(
      this.handleNotification,
    )
    AnalyticsManager.initialise()
  }

  loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      require(`./assets/images/undraw_calendar.png`),
      require(`./assets/images/undraw_relaxation.png`),
      require(`./assets/images/undraw_graduation.png`),
      require(`./assets/images/undraw_building_blocks.png`),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Feather.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      "space-mono": require(`./assets/fonts/SpaceMono-Regular.ttf`),
      apercu: require(`./assets/fonts/somerandomfont.otf`),
      "apercu-bold": require(`./assets/fonts/somerandomfont-Bold.otf`),
      "apercu-light": require(`./assets/fonts/somerandomfont-Light.otf`),
    }),
  ])

  handleLoadingError = (error) => {
    ErrorManager.captureError(error)
  }

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }

  handleNotification = (notification) => console.log(`Received notification`, notification)

  onNavigationStateChange = (prevState, currentState) => {
    const currentScreen = App.getActiveRouteName(currentState)
    const prevScreen = App.getActiveRouteName(prevState)

    if (prevScreen !== currentScreen) {
      AnalyticsManager.logScreenView(currentScreen)
    }
  }

  render() {
    const { isLoadingComplete } = this.state
    const { skipLoadingScreen } = this.props
    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      )
    }
    const {
      store: { store: stateStore, persistor: statePersistor },
    } = this.state
    return (
      <Provider store={stateStore}>
        <PersistGate persistor={statePersistor}>
          <View style={Styles.app}>
            <StatusBar
              barStyle="dark-content"
              hidden={false}
              backgroundColor={Colors.pageBackground}
            />
            <RootNavigation
              onNavigationStateChange={this.onNavigationStateChange}
            />
          </View>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
