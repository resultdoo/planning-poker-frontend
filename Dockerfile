FROM node:13.12.0-alpine
WORKDIR /usr/src/app

ADD package.json ./
RUN yarn install

ADD public ./public
ADD src ./src

ARG PUBLIC_URL=${PUBLIC_URL}
ARG REACT_APP_HASURA_URL=${REACT_APP_HASURA_URL}
ARG REACT_APP_HASURA_SUBSCRIPTION_URL=${REACT_APP_HASURA_SUBSCRIPTION_URL}

VOLUME /tmp

RUN PUBLIC_URL=${PUBLIC_URL} yarn build

RUN yarn global add serve
CMD serve -s build -l 80