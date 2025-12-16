const contractAddress = "0x7EDc71fefE6ED1BaA0680204Ce16B652a8c76eB9";

const abi = [ /* вставь сюда тот же abi, который ты прислал — он идеально подходит */ 
  {"type":"function","name":"getMessage","inputs":[{"name":"index","type":"uint256"}],"outputs":[{"name":"sender","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"content","type":"string"}],"stateMutability":"view"},
  {"type":"function","name":"messageCount","inputs":[],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"sendMessage","inputs":[{"name":"_content","type":"string"}],"outputs":[],"stateMutability":"nonpayable"}
];

window.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectBtn");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");
  const messagesList = document.getElementById("messagesList");
  const msgCount = document.getElementById("msgCount");
  const emojiRain = document.getElementById("emojiRain");

  let provider, signer, contract;

  // Прыгающие 👾 каждые 1.5 секунды
  setInterval(() => {
    const emoji = document.createElement("div");
    emoji.textContent = "👾";
    emoji.style.position = "absolute";
    emoji.style.fontSize = Math.random() * 30 + 20 + "px";
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.top = "-50px";
    emoji.style.animation = `fall ${Math.random() * 4 + 3}s linear`;
    emojiRain.appendChild(emoji);
    setTimeout(() => emoji.remove(), 7000);
  }, 1500);

  connectBtn.onclick = async () => {
    if (!window.ethereum) return alert("Установи MetaMask!");
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      const addr = await signer.getAddress();
      connectBtn.innerText = `👾 ${addr.slice(0,6)}...${addr.slice(-4)}`;
      connectBtn.disabled = true;
      loadMessages();
    } catch (err) { alert("Ошибка: " + err.message); }
  };

  async function loadMessages() {
    if (!contract) return;
    const count = await contract.messageCount();
    msgCount.textContent = count;
    messagesList.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const [sender, timestamp, content] = await contract.getMessage(i);
      const date = new Date(Number(timestamp) * 1000).toLocaleString("ru-RU");
      const li = document.createElement("li");
      li.innerHTML = `<strong>${sender.slice(0,10)}...</strong> (${date})<br>${content}`;
      messagesList.prepend(li);
    }
  }

  sendBtn.onclick = async () => {
    if (!contract) return alert("Сначала подключи MetaMask!");
    const text = messageInput.value.trim();
    if (!text) return alert("Напиши хоть что-то!");
    try {
      sendBtn.disabled = true;
      sendBtn.textContent = "Лечу...";
      const tx = await contract.sendMessage(text);
      await tx.wait();
      messageInput.value = "";
      loadMessages();
    } catch (err) { alert("Ошибка: " + err.message); }
    finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Отправить 👾";
    }
  };
});