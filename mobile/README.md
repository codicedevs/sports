# Agregar estilo al theme
para agregar un estilo al theme hace falta no solo modificar el tema sino tambien el type

 colors: {
        primary: "#0070f3",
        secondary: "#1c1c1c",
        accent: "#e91e63",
        background: "#f0f0f0",
        text: "#333333",
        cardBorder: "lightgray",
        nuevoColor: '#FFFFFF'
    }

    EN TYPE

     colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        cardBorder: string;
        nuevoColor: string
    };

y ya estaria

# Agregar pantalla

Al querer agregar una pantalla nueva a los stacks hace falta agregarla en screens.tsx primero

export enum AppScreens {
    LOGIN_SCREEN = 'LoginScreen',
    HOME_SCREEN = 'HomeScreen',
    TRIAL1_SCREEN = 'Trial1',
    TRIAL2_SCREEN = 'Trial2',
    SETTINGS_SCREEN = 'Settings'
    NOMBRE_SCREEN = 'Nombre'
}

export type AppScreensParamList = {
    [AppScreens.LOGIN_SCREEN]: undefined;
    [AppScreens.HOME_SCREEN]: undefined;
    [AppScreens.TRIAL1_SCREEN]: undefined;
    [AppScreens.TRIAL2_SCREEN]: undefined;
    [AppScreens.SETTINGS_SCREEN]: undefined;
    [AppScreens.NOMBRE_SCREEN]: undefined
}

# Agregar stack/drawer/tab nuevo

hace falta crear la instancia dependiendo de lo que queramos crear

const yourNameStack = createNativeStackNavigator<AppScreensParamList>()
const yourNameTab = createBottomTabNavigator<AppScreensParamList>();
const yourNameDrawer = createDrawerNavigator<AppScreensParamList>();

se le agrega <AppScreensParamList> para tipar los parametros que reciben

usando uno de estos, tenemos que crear el navigator primero y dentro las screens

en este caso usare drawer
export function newDrawer(){
    return(
        <Drawer.Navigator>
            <Drawer.Screen name={AppScreens.Pantallaquequieras} component={componente} />
        </Drawer.Navigator>
    )
}

# Agregarle a una pantalla un parametro

[AppScreens.TUPANTALLA_SCREEN]: { productId: string };

asi en el componente de esta pantalla podes usarlo con route.params

# usar los hooks useQuery

usa keys para dividir los procesos dependiendo lo que estemos llamando

ejemplo
export enum QUERY_KEYS {
    USERS = 'users',
    PRODUCTS = 'products',
    BOOKMARKS = 'bookmarks'
}

## useGet
traer datos

  const tuFuncion = async () => {
      ...
    };

    const { data, isFetching, isFetched } = useFetch<Product[]>({
        fn: tuFuncion,
        key: [QUERY_KEYS.tuKey],
        triggerLoader: false
    });

con esto ya podes usar la informacion de data para lo que quieres

useGet tambien viene con la opcion de agregarle initialData lo que sirve para ayudar con la creacion del skeletton

## useMutate
manejo de funciones

  const tuFuncion = async () => {
   
  };

  const tuQuery = useMutate(
    tuFuncion,
    (res) => {
      //en caso que todo salga bien corre esto
    },
    (err) => {
    // en caso que algo salga mal corre esto
    }
  );

basicamente le pasas una funcion y te crea una query que podes usar donde vos quieras


## useOptimistic
comportamiento optimista

usarlo cuando quiere verse un cambio visual optimista antes de que termine de correrse la funcion

  const addLike = useOptimistic({
        mutationFn: tuFuncion,
        key: QUERY_KEYS.tuKey,
        onMutate: () => {
            // el comportamiento optimista que se espera
        },
        onError: () => {
            // el comportamiento en caso que no funcione, que deshaga el comportamiento optimista
        },
    });


# notificaciones

const { showSnackBar } = useGlobalUI()
importar esto donde quieras usarlo

   showSnackBar("success", "Exito")

    showSnackBar("error", "Error")

# loading

donde se quiera agregar un loader se usa

const { setIsLoading } = useLoading();
