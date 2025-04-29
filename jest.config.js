module.exports = {
  testMatch: [
    "**/simple.test.js",
    "**/example.test.js",
    "**/simple-react.test.js",
    "**/redux-component.test.js"
  ],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "@/(.*)$": "<rootDir>/client/src/$1",
    "@shared/(.*)$": "<rootDir>/shared/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};
