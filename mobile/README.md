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

  esta es la funcion con la que vas a traer datos del backend

# Ejemplo de uso
    const { data } = useFetch<User[]>({
    fn: userService.getAll,
    key: [QUERY_KEYS.USERS],
    triggerLoader: false,
    options: { meta: { triggerGlobalLoader: false } },
    });

# que parametros puede recibir useFetch :

fn: Función que realiza la solicitud de datos (debe retornar una promesa).
key: Clave única para identificar la consulta. que es la q tenias que crear
initialData: Define datos iniciales mientras se cargan los definitivos. Necesario para el uso de skeletton
triggerLoader: Si está activado, actualiza el estado de carga global.
    


    const { data, isFetching, isFetched } = useFetch<Product[]>({
        fn: tuFuncion,
        key: [QUERY_KEYS.tuKey],
        triggerLoader: false
    });

# que devuelve
data: que es el array con los datos de la funcion que le diste
isFetching: que es un booleano que te dice si lo esta buscando o no los datos
isFetched: te dice si ya fueron o no buscados los datos

con esto ya podes usar la informacion de data para lo que quieres

useGet tambien viene con la opcion de agregarle initialData lo que sirve para ayudar con la creacion del skeletton

## useMutate
Esta es la función con la que puedes realizar mutaciones (crear, actualizar o eliminar datos en el backend).

# Ejemplo de uso

const createUser = async (userData) => {
  // Lógica para crear un usuario
};

const handleSuccess = (result) => {
  console.log("Usuario creado:", result);
};

const handleError = (error) => {
  console.error("Error al crear usuario:", error);
};

const mutate = useMutate(createUser, handleSuccess, handleError, true);

const onSubmit = async () => {
  try {
    await mutate({ name: "Nuevo Usuario" });
  } catch (error) {
    console.error(error);
  }
};

# que parametros puede recibir

mutationFn:
Es la función que realiza la mutación (debe retornar una promesa).

onSuccess:
Una función que se ejecuta si la mutación se realiza con éxito. Puedes usarla para manejar el resultado o actualizar el estado de la aplicación.

onError:
Una función que se ejecuta si la mutación falla. Útil para manejar errores.

triggerLoader:
Si está activado (true), conecta el estado de la mutación a un loader global manejado por tu contexto de carga.

# que devuelve

mutateAsync:
Es una función que puedes llamar para ejecutar la mutación.
Recibe: Los parámetros necesarios para tu mutación (por ejemplo, datos a enviar al backend).
Devuelve: Una promesa que se resuelve con el resultado de la mutación o se rechaza con un error.


## useOptimistic
Esta función permite realizar mutaciones optimistas, actualizando los datos del frontend antes de confirmar el resultado desde el backend. 

usarlo cuando quiere verse un cambio visual optimista antes de que termine de correrse la funcion

# Ejemplo de uso

const addTodo = async (newTodo) => {
  // Lógica para agregar un todo en el backend
};

const handleSuccess = () => {
  console.log("Elemento agregado con éxito.");
};

const handleError = (error) => {
  console.error("Error al agregar el elemento:", error);
};

const { mutateAsync } = useOptimistic({
  key: "todos",
  mutationFn: addTodo,
  onSuccess: handleSuccess,
  onError: handleError,
  onMutate: (data) => {
    console.log("Elemento optimista agregado:", data);
  },
  triggerLoader: true,
});

// Usando mutateAsync
const onSubmit = async () => {
  try {
    await mutateAsync({ id: 1, text: "Nuevo Todo" });
  } catch (error) {
    console.error(error);
  }
};

# que parametros puede recibir

key:
La clave única que identifica los datos en el cache de react-query.

mutationFn:
La función que realiza la mutación en el backend. Debe retornar una promesa.

onSuccess (opcional):
Una función que se ejecuta cuando la mutación se realiza con éxito.

onError (opcional):
Una función que se ejecuta cuando la mutación falla.

onMutate (opcional):
Una función que se ejecuta antes de realizar la mutación, permitiendo actualizar los datos en el cache de manera optimista.

triggerLoader (opcional):
Si está activado (true), conecta el estado de la mutación a un loader global manejado por tu contexto de carga.

# Que devuelve

mutateAsync:
La función que puedes llamar para ejecutar la mutación.
Recibe: Los parámetros necesarios para tu mutación (por ejemplo, datos a enviar al backend).
Devuelve: Una promesa que se resuelve con el resultado de la mutación o se rechaza con un error.

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

const handleSuccess = () => {
    showSnackBar("success", "Operación exitosa!");
  };

# loading

donde se quiera agregar un loader se usa

const { setIsLoading } = useLoading();

const funcion = () => {
    try{
    setIsloading(true)
    llamadaBackend()
    }
    catch(e){
    } finally{
        setIsLoading(false)
    }

  };