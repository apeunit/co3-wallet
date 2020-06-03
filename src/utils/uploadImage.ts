export const uploadImage = async (image: any) =>
  new Promise((resolve) => {
    const r = new XMLHttpRequest();
    const d = new FormData();

    d.append('image', image);

    r.open('POST', 'https://api.imgur.com/3/image/');
    r.setRequestHeader('Authorization', `Client-ID ad783087232e187`);
    r.onreadystatechange = () => {
      if (r.status === 200 && r.readyState === 4) {
        resolve(JSON.parse(r.responseText));
      }
    };
    r.send(d);
  });
