**Hack**

**Solve all your logging and logout problems** 🔐

Hack is an open source library that makes it easy to implement secure logging and logout functionality in your web applications. It provides a variety of features, including:

* User authentication and authorization
* Session management
* Password hashing and salting
* Logging and auditing
* CSRF protection
* Logout prevention

Hack is designed to be easy to use and integrate with existing applications. It is also highly extensible, so you can customize it to meet your specific needs.

**Getting started**

To get started with Hack, simply install the package:

```
npm install hack
```
You can also install the library using pip:

```bash
pip install hack
```

Or you can clone the repo and install it from source:

```bash
git clone https://github.com/your_username/hack.git
cd hack
python setup.py install
```

Once Hack is installed, you can create a new user account:

```
const hack = require('hack');

const user = await hack.createUser({
  username: 'my_username',
  password: 'my_password',
});
```

Once you have a user account, you can log them in:

```
const token = await hack.login(user);
```

You can then use the token to authenticate the user and access their account data.

To log the user out, simply call the `logout()` function:

```
hack.logout();
```
## Features
- Easy to use: just import the library and start logging with one line of code.
- Customizable: you can configure the log level, format, handler, and output destination.
- Flexible: you can create multiple loggers with different settings and use them in different modules.
- Reliable: you can handle exceptions and errors gracefully and log them with stack traces.
- Compatible: you can use the library with any Python version from 2.7 to 3.9.

## Usage
To use the library, you need to import it and create a logger object:

```python
import hack
logger = hack.Logger()
```

Then you can use the logger methods to log messages with different levels:

```python
logger.debug("This is a debug message")
logger.info("This is an info message")
logger.warning("This is a warning message")
logger.error("This is an error message")
logger.critical("This is a critical message")
```

By default, the messages will be printed to the standard output (console) with the following format:

```
[2023-10-21 01:05:22] [DEBUG] This is a debug message
[2023-10-21 01:05:22] [INFO] This is an info message
[2023-10-21 01:05:22] [WARNING] This is a warning message
[2023-10-21 01:05:22] [ERROR] This is an error message
[2023-10-21 01:05:22] [CRITICAL] This is a critical message
```

The format consists of four parts: the timestamp, the log level, the module name, and the message. You can customize the format by passing a string to the `format` parameter when creating the logger object:

```python
logger = hack.Logger(format="%(message)s")
```

The string can contain any of the following placeholders:

| Placeholder | Description |
| ----------- | ----------- |
| %(asctime)s | The date and time of the log event |
| %(levelname)s | The name of the log level |
| %(module)s | The name of the module where the log event occurred |
| %(message)s | The log message |

You can also change the log level by passing a string or an integer to the `level` parameter when creating the logger object:

```python
logger = hack.Logger(level="INFO")
```

The valid log levels are:

| Level | Value |
| ----- | ----- |
| DEBUG | 10 |
| INFO | 20 |
| WARNING | 30 |
| ERROR | 40 |
| CRITICAL | 50 |

The logger will only log messages that have a level equal or higher than the specified level. For example, if you set the level to "INFO", then only messages with "INFO", "WARNING", "ERROR", and "CRITICAL" levels will be logged.

You can also specify a different output destination for the log messages by passing a file object or a file name to the `output` parameter when creating the logger object:

```python
logger = hack.Logger(output="log.txt")
```

This will write the log messages to a file named "log.txt" in the current directory. You can also use any file-like object that supports writing, such as `sys.stdout` or `sys.stderr`.

If you want to use more than one output destination, you can use the `add_handler` method to add additional handlers to the logger object:

```python
logger.add_handler(hack.FileHandler("log.txt"))
logger.add_handler(hack.StreamHandler(sys.stderr))
```

A handler is an object that receives log messages from a logger and writes them to a specific destination. The library provides two built-in handlers: `FileHandler` and `StreamHandler`. You can also create your own custom handlers by subclassing the `BaseHandler` class and overriding its `write` method.

If you want to remove a handler from the logger object, you can use the `remove_handler` method:

```python
logger.remove_handler(handler)
```

You need to pass the handler object that you want to remove as an argument.

If you want to handle exceptions and errors in your code and log them with stack traces, you can use the `exception` method of the logger object:

```python
try:
    # some code that may raise an exception
except Exception as e:
    logger.exception(e)
```

This will log the exception message and the stack trace with the "ERROR" level. You can also pass a custom message as an optional argument:

```python
logger.exception(e, "Something went wrong")
```

This will log the custom message followed by the exception message and the stack trace.

## Documentation
You can find the full documentation of the library [here].

## License
This project is licensed under the MIT License - see the [LICENSE] file for details.

## Contributing
We welcome contributions from anyone who wants to improve this project. Please follow these steps to contribute:

- Fork the repo and create your branch from `master`.
- Make your changes and write tests if necessary.
- Run the tests and check the code style with `pytest` and `flake8`.
- Commit your changes and push to your branch.
- Create a pull request and describe your changes.

## Contact
If you have any questions, suggestions, or feedback, please feel free to contact us at hack@hack.com.
