

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 一、项目概述

## 二、项目目录结构
项目名(文件名)
├──dist 打包的目录
├──node_modules 模块依赖安装存放目录
├──test 测试的目录
├──src 源码目录
├───── common - 公共的东西如: 守卫、过滤器、中间件、拦截器等
├───── config - 全局配置文件存放位置
├───── modules - 各个模块存放位置
├───── ..... 其它
├───── app.controller.spec.ts 针对控制器的单元测试
├───── app.controller.ts 一个具有单一路由的基本控制器(Controller)
├───── app.module.ts 应用程序的根模块(Module)
├───── app.service.ts 具有单一方法的基本服务(Service)
├───── main.ts nest 应用程序的入口文件，

## 三、项目依赖搭建

### 1. 全局配置抽离
这里使用的自定义配置文件( yaml 配置文件 )的方式、如下是一个生产环境的配置文件 dev.yml

```yaml
-- config/dev.yml
# 开发环境配置
app:
  prefix: ''
  port: 8080
  logger:
    # 项目日志存储路径，相对路径（相对本项目根目录）或绝对路径
    dir: '../logs'
  # 文件相关
  file:
    # 是否为本地文件服务或cos
    isLocal: true
    # location 文件上传后存储目录，相对路径（相对本项目根目录）或绝对路径
    location: '../upload'
    # 文件服务器地址，这是开发环境的配置 生产环境请自行配置成可访问域名
    domain: 'http://localhost:8080'
    # 文件虚拟路径, 必须以 / 开头， 如 http://localhost:8081/static/****.jpg  , 如果不需要则 设置 ''
    serveRoot: '/upload'
    # 文件大小限制，单位M
    maxSize: 10
```

为了读取和解析 YAML 文件，我们可以利用 js-yaml 包。
安装了该包后，我们使用 yaml#load 函数来加载上面创建的 YAML 文件  dev.yml。
```bash
$ pnpm install js-yaml
$ pnpm i -D @types/js-yaml
$ pnpm i --save @nestjs/config
$ pnpm i -D cross-env
```

### 2. mysql 数据库连接
为了读取全局配置里的东西、数据库连接使用异步方式。
```bash
$ pnpm install --save @nestjs/typeorm typeorm mysql2

```



## License

Nest is [MIT licensed](LICENSE).