const axios = require("axios");
const { stacks, levels, packages } = require("./logLevels");

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

const validateLogInput = (stack, level, pkg) => {
  const isValidStack = stacks.includes(stack);
  const isValidLevel = levels.includes(level);
  const validPackages = [...packages[stack], ...packages.both];
  const isValidPackage = validPackages.includes(pkg);
  return isValidStack && isValidLevel && isValidPackage;
};

const logEvent = async (token, stack, level, pkg, message) => {
  if (!validateLogInput(stack, level, pkg)) {
    console.error("❌ Invalid log parameters");
    return;
  }

  try {
    const response = await axios.post(
      LOG_ENDPOINT,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Log Success:", response.data);
  } catch (error) {
    console.error("❌ Log Failed:", error.response?.data || error.message);
  }
};

module.exports = { logEvent };
