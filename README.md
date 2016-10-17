ABOUT
===

CLI (command lint interface) that helps translate input text

> i wrote this to learn how to write CLI-s with Node, but it should perfectly workable.

# HOW TO USE

install using this command

```bash
node install -g cli-translator
```

and use it

```terminal
translate # will prompty for input
translate hello # translate english word to chinese
translate "hello world" # translate english sentence to chinese
translate 你好 # translate chinese to english
```

# TODO

```
--youdao
--iciba

config - set personal keys
-v
--version
--help
--show error
```

# ABOUT DEVELOP

setting up

```
npm install
```

testing source

```
node index ...
```

install local code

```
npm install -g
```

publish to git and npm

```
git commit -m "..."
git push
git tag x.y.z
git push origin x.y.z
npm publish
```

# ABOUT ONLINE TRANSLATE APIS

## youdao

使用 API key 时，请求频率限制为每小时 1000 次，超过限制会被封禁。所以，如果可以的话最好自行去 <http://fanyi.youdao.com/openapi?path=data-mode> 申请属于自己的 API Key，申请过程十分简单，只需要提供如下信息：

* 应用名称
* 应用地址
* 应用说明
* 联系邮箱

系统并不会做校验，立马申请成功。

然后执行，如下命令进行设置：

```
translate config key
```

