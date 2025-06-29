const validateName = (name) => {
  if (!name) return { valid: false, message: "Name is required" };
  if (name.length < 2)
    return { valid: false, message: "Name must be at least 2 characters long" };
  if (name.length > 30)
    return { valid: false, message: "Name must not exceed 30 characters" };
  return { valid: true };
};

const validateURL = (url) => {
  const urlRegex = /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/;
  if (!url) return { valid: false, message: "Image URL is required" };
  if (!urlRegex.test(url))
    return { valid: false, message: "Image URL must be a valid URL" };
  return { valid: true };
};

const validateId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

module.exports = { validateName, validateURL, validateId };
