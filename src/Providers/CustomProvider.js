class CustomProvider {
    constructor(propertiesPanel) {
        propertiesPanel.registerProvider(LOW_PRIORITY, this);
    }

    getGroups() {
        return function (groups) {
            const generalGroup = groups.find(({ id }) => id === "general");

            if (generalGroup) {
                generalGroup.entries = generalGroup.entries.filter(
                    ({ id }) => id !== "isExecutable"
                );
            }

            return groups;
        };
    }
}