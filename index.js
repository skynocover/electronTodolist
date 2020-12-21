// const { v1: uuidv1 } = require('uuid');

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  switch (request.method) {
    case 'GET':
      return getTodos(request);
    case 'POST':
      return postTodos(request);
    case 'DELETE':
      return delTodos(request);
    case 'PUT':
      return putTodos(request);
    default:
      break;
  }
}

const setCache = (data) => TOTOS.put('data', data);
const getCache = () => TOTOS.get('data');

const delTodos = async (request) => {
  const body = await request.text();
  try {
    const cache = await getCache();
    let cachejson = [];
    if (cache) {
      cachejson = JSON.parse(cache);
    }

    // console.log(JSON.stringify(cachejson));
    let bodyjson = JSON.parse(body);
    // console.log(bodyjson);

    bodyjson.keys.map((item) => {
      const index = cachejson.findIndex((element) => element.key === item);
      if (index > -1) {
        console.log('find!');
        cachejson.splice(index, 1);
      }
    });
    console.log('data: ' + JSON.stringify(cachejson));

    await setCache(JSON.stringify(cachejson).replace(/</g, '\\u003c'));

    return new Response(body, { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new Response(JSON.stringify({ err: err.message }), { status: 500 });
  }
};

const putTodos = async (request) => {
  const body = await request.text();
  try {
    const cache = await getCache();
    let cachejson = [];
    if (cache) {
      cachejson = JSON.parse(cache);
    }

    let bodyjson = JSON.parse(body);
    if (bodyjson.key && bodyjson.completed != undefined) {
      let newlist = cachejson.map((element) => {
        if (element.key == bodyjson.key) {
          element.completed = bodyjson.completed;
        }
        return { ...element };
      });
      await setCache(JSON.stringify(newlist).replace(/</g, '\\u003c'));
      return new Response(body, { status: 200 });
    }

    throw new Error('Wrong Input');
  } catch (err) {
    console.log(err.message);
    return new Response(JSON.stringify({ err: err.message }), { status: 500 });
  }
};

const postTodos = async (request) => {
  const body = await request.text();
  try {
    const cache = await getCache();
    let cachejson = [];
    if (cache) {
      cachejson = JSON.parse(cache);
    }

    let bodyjson = JSON.parse(body);
    console.log(bodyjson);
    if (bodyjson.key && bodyjson.name) {
      let input = {
        key: bodyjson.key,
        name: bodyjson.name,
        completed: false,
      };
      console.log('input', JSON.stringify(input));
      cachejson.push(input);

      await setCache(JSON.stringify(cachejson).replace(/</g, '\\u003c'));
      return new Response(body, { status: 200 });
    }
    throw new Error('Wrong Input');
  } catch (err) {
    return new Response(JSON.stringify({ err: err.message }), { status: 500 });
  }
};

const getTodos = async () => {
  const cache = await getCache();
  // console.log('data: ', JSON.stringify(data));

  return new Response(cache, {
    headers: { 'Content-Type': 'application/json' },
  });
};
