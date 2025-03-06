import MagicPropertiesProvider from './MagicPropertiesProvider';
import FormPropertiesProvider from "./Providers/FormPropertiesProvider2.js";


export default [{
    __init__: [ 'magicPropertiesProvider'],
    magicPropertiesProvider: [ 'type', MagicPropertiesProvider ]
},{
    __init__: [ 'formPropertiesProvider'],
    formPropertiesProvider: [ 'type', FormPropertiesProvider ]
}];