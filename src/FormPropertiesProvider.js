// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import spellProps from './parts/SpellProps';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import FormRefProps from "./parts/FormRefProps.js";

const LOW_PRIORITY = 500;
const HIGH_PRIORITY = 900;

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function FormPropertiesProvider(propertiesPanel, translate) {

    // API ////////

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function(element) {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return function(groups) {

            // Add the "form" group
            if(is(element, 'bpmn:StartEvent') || is(element, 'bpmn:UserTask') ) {
                groups.push(createFormGroup(element, translate));
            }

            return groups;
        }
    };


    // registration ////////

    // Register our custom form properties provider.
    // Use a lower priority to ensure it is loaded after
    // the basic BPMN properties.
    propertiesPanel.registerProvider(HIGH_PRIORITY, this);
}

FormPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ];

// Create the custom magic group
function createFormGroup(element, translate) {

    // create a group called "Magic properties".
    const formGroup = {
        id: 'form',
        label: translate('Form properties'),
        entries: FormRefProps(element)
    };

    return formGroup
}
