const UnsupportedValue = require("./errors/UnsupportedValue");
const jsontoxml = require("jsontoxml");

class Serializer {
  json(data) {
    return JSON.stringify(data);
  }

  xml(data) {
    let tag = this.singularTag;

    if (Array.isArray(data)) {
      tag = this.pluralTag;
      data = data.map((item) => {
        return {
          [this.singularTag]: item,
        };
      });
    }
    return jsontoxml({ [tag]: data });
  }

  serialize(data) {
    data = this.filter(data);
    if (this.contentType === "application/json") {
      return this.json(data);
    }

    if (this.contentType === "application/xml") {
      return this.xml(data);
    }

    throw new UnsupportedValue(this.contentType);
  }

  filterObject(data) {
    const newObject = {};

    this.publicFields.forEach((field) => {
      if (data.hasOwnProperty(field)) {
        newObject[field] = data[field];
      }
    });

    return newObject;
  }

  filter(data) {
    if (Array.isArray(data)) {
      data = data.map((item) => {
        return this.filterObject(item);
      });
    } else {
      data = this.filterObject(data);
    }

    return data;
  }
}

class SerializerProvider extends Serializer {
  constructor(contentType, extraFields = "") {
    super();
    this.contentType = contentType;
    this.publicFields = ["id", "company", "category", ...extraFields];
    this.singularTag = "provider";
    this.pluralTag = "providers";
  }
}

class SerializerProduct extends Serializer {
  constructor(contentType, extraFields = "") {
    super();
    this.contentType = contentType;
    this.publicFields = ["id", "title", ...extraFields];
    this.singularTag = "product";
    this.pluralTag = "products";
  }
}

class SerializerError extends Serializer {
  constructor(contentType, extraFields = "") {
    super();
    this.contentType = contentType;
    this.publicFields = ["id", "message", ...extraFields];
    this.singularTag = "error";
    this.pluralTag = "errors";
  }
}

module.exports = {
  Serializer,
  SerializerProvider,
  SerializerError,
  SerializerProduct,
  acceptedFormats: ["application/json", "application/xml"], //Foi definido dessa forma pq assim é possível facilitar quando formos aceitar outros formatos
};
