import MagicPropertiesProvider from './MagicPropertiesProvider';
import FormPropertiesProvider from "./FormPropertiesProvider2.js";


export default [{
    __init__: [ 'magicPropertiesProvider'],
    magicPropertiesProvider: [ 'type', MagicPropertiesProvider ]
},{
    __init__: [ 'formPropertiesProvider'],
    formPropertiesProvider: [ 'type', FormPropertiesProvider ]
}];