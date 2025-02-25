FROM node AS build
WORKDIR /code
COPY package.json .
RUN npm i
COPY . .
ARG EXPO_PUBLIC_API_BASE_URL
ENV EXPO_PUBLIC_API_BASE_URL=$EXPO_PUBLIC_API_BASE_URL
ENV EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1041111204276-r7j7usuv4qs8qfr9052pu7tbj4mi01pl.apps.googleusercontent.com
ENV EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=1041111204276-kpi8vlp8d72qevksphdefo90baoik2ep.apps.googleusercontent.com
ENV EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=1041111204276-a0ae9633f1ltonn0hsdlg0lo4bd99h3q.apps.googleusercontent.com
RUN npm run build:web

FROM nginx:alpine
COPY --from=build /code/dist /usr/share/nginx/html
COPY --from=build /code/nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
