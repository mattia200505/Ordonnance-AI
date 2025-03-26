class OrdonnanceObject {
    constructor(response) {
      this.response = response;
      this.data = this.parseResponse(response);
    }
  
    // Méthode pour analyser et extraire les informations du texte structuré
    parseResponse(responseText) {
      const sections = responseText.split(" Ordonnance| "); // Diviser le texte en deux parties : Patient et Ordonnance
      const patientInfo = sections[0]; // Informations sur le patient
      const ordonnanceInfo = sections[1]; // Informations sur l'ordonnance
  
      const data = {
        patient: {},
        ordonnance: {},
      };
  
      // Analyse des informations sur le patient
      const patientSections = patientInfo.split("|").map(section => section.trim());
      patientSections.forEach((section) => {
        const [key, value] = section.split(":").map(str => str.trim());
        if (key && value) {
          data.patient[key] = value;
        }
      });
  
      // Analyse des informations sur l'ordonnance
      const ordonnanceSections = ordonnanceInfo.split("|").map(section => section.trim());
      ordonnanceSections.forEach((section) => {
        const [key, value] = section.split(":").map(str => str.trim());
        if (key && value) {
          if (key === "Prescription") {
            // Traiter la prescription si elle contient plusieurs éléments séparés par "|"
            data.ordonnance[key] = value.split(" | ").map(item => item.trim());
          } else {
            data.ordonnance[key] = value;
          }
        }
      });
  
      return data;
    }
  
    // Retourner les informations sur le patient
    getPatientInfo() {
      return this.data.patient;
    }
  
    // Retourner les détails de l'ordonnance
    getOrdonnanceDetails() {
      return this.data.ordonnance;
    }
  }
  
  export default OrdonnanceObject;
  