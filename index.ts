/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import TODOOAuth2Client from './oauth2-client-app-script/todoOAuth2';
import config from './config';
import ToDo from './microsoft-todo-app-script/todo';
import ProviderFactory from './provider-factory';
import GMail from './gmail-app-script/gmail';
import Runner from './runner';

const LOGIN_SECRET_KEY = 'login_secret';

const CLIENT_SECRET_KEY = 'client_secret';

const REFRESH_TOKEN_KEY = 'refresh_token';

function setLoginSecret() {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(LOGIN_SECRET_KEY, '');
}

function getLoginSecret() {
  const userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty(LOGIN_SECRET_KEY);
}

function setClientSecret() {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(CLIENT_SECRET_KEY, '');
}

function getClientSecret() {
  const userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty(CLIENT_SECRET_KEY);
}

function setRefreshToken(value: string) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(REFRESH_TOKEN_KEY, value);
}

function getRefreshToken(): string {
  const userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty(REFRESH_TOKEN_KEY);
}

function doGet(e: GoogleAppsScript.Events.DoGet) {
  const scriptSecret = getLoginSecret();
  const storage = PropertiesService.getUserProperties();
  const todoClient = new TODOOAuth2Client(storage, config.clientID, getClientSecret());
  let tokens;
  switch (e.pathInfo) {
    case 'LOGIN':
      if (scriptSecret !== e.parameter.loginsecret) {
        throw new Error('Secret does not match');
      }
      return todoClient.authorize(config.redirectURI, config.scopes, 'code');
    case 'REDIRECT':
      tokens = todoClient.getTokenFromAuthorizationCode(
        config.scopes,
        config.redirectURI,
        e.parameter.state,
        e.parameter.code,
      );
      setRefreshToken(tokens.refresh_token);
      return HtmlService.createHtmlOutput('Success');
    default:
  }
  return HtmlService.createHtmlOutput('Error');
}

function getToDoAccessTokenFromRefreshToken() {
  const storage = PropertiesService.getUserProperties();
  const todoClient = new TODOOAuth2Client(storage, config.clientID, getClientSecret());
  const tokens = todoClient.getTokenFromRefreshToken(
    config.scopes,
    config.redirectURI,
    getRefreshToken(),
  );
  if (tokens) {
    if (tokens.refresh_token) {
      setRefreshToken(tokens.refresh_token);
    }
    return tokens.access_token;
  }
  return null;
}

function setLastExecutedTransaction() {
  const storage = PropertiesService.getUserProperties();
  const gmail = new GMail(GmailApp);
  const providerFactory = new ProviderFactory(gmail, storage);
  providerFactory.setProviderLastExecutedTransaction('SC', '');
}

function remindTransactions() {
  console.log('Started Execution');
  const storage = PropertiesService.getUserProperties();
  const gmail = new GMail(GmailApp);
  const providerFactory = new ProviderFactory(gmail, storage);
  const accessToken = getToDoAccessTokenFromRefreshToken();
  console.log('Got access token');
  const todo = new ToDo(UrlFetchApp, accessToken);
  const runner = new Runner(['SC'], providerFactory, todo);
  runner.run();
  console.log('Ended Execution');
}
