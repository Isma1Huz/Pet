//Grap the form elements
const form = document.querySelector("form");
const AllInput = document.querySelectorAll(".inputs");
const submitBtn = document.querySelector(".submit");

//function to create the
function inputObject(input) {
  let formObject = {};
  for (let i = 0; i < input.length; i++) {
    input[i].addEventListener("input", (e) => {
      input[i].setAttribute("value", `${e.target.value}`);
      formObject[input[i].id] = input[i].value;
    });
  }

  // formObject.votes = votes;
  postForm(formObject, input);
}
//the input object creator
inputObject(AllInput);
//the POST function
function postForm(formObject, input, votes = 0) {
  console.log(formObject);

  submitBtn.addEventListener("click", () => {
    if (input[0].value === "" || input[1].value === "") {
      alert("please fill  all the input fiels");
    } else if (
      !input[1].value.includes("https") ||
      !input[1].value.includes("https")
    ) {
      alert("this is not an Image LINK");
    } else {
      formObject.votes = votes;
      joinTheFamily(formObject);

      for (const key in formObject) {
        delete formObject[key];
      }
      input.forEach((currentInput) => {
        currentInput.value = "";
      });
    }
  });
}
function joinTheFamily(formObject) {
  fetch(`https://pet-heaven-server.onrender.com/characters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });
}
// Function that creates the cards
function renderCard(animals) {
  const mainDiv = document.querySelector("#main");

  for (const animal of animals) {
    const Card = document.createElement("div");
    Card.classList.add("card");
    Card.innerHTML = `
      <h1 class="card-title">${animal.name}</h1>
      <a href=""><i id="trash-${animal.id}" class="fa-solid fa-trash-can fa-xs"></i></a>

      <div class="card-body card-bodyHover">
        <img src="${animal.image}" class="card-img" alt="" />
        <div class="">
        <button type="button" class="card-btn votes" data-animal-id="${animal.id}" data-animal-votes="${animal.votes}"> Votes: ${animal.votes}</button>       
        <button type="button" class="card-btn reset" data-reset-id="${animal.id}" > Reset </button>
      </div>
      </div>
    `;

    mainDiv.append(Card);

    //trash i con deleltes
    let deleteIcon = document.getElementById(`trash-${animal.id}`);
    deleteIcon.addEventListener("click", () => {
      DeleteCard(animal.id);
    });
  }

  let voteBtn = mainDiv.querySelectorAll(".card .votes");
  let resetBtn = mainDiv.querySelectorAll(".card .reset");
  // console.log(resetBtn);
  //**********INCREASES THE VOTE COUNT************************** */
  voteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const animalID = btn.getAttribute("data-animal-id");
      const animalVotes = parseInt(btn.getAttribute("data-animal-votes"));
      console.log(animalVotes);

      IncreaseVoteCount(animalID, animalVotes, btn);
    });
    //***********RESETS THE VOTE COUNT************************ */
    resetBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        let resetID = btn.getAttribute("data-reset-id");
        voteReseter(resetID);
      });
    });
  });

  clickAnimalName(mainDiv);
} //DeleteCard
function DeleteCard(animalID) {
  fetch(`https://pet-heaven-server.onrender.com/characters/${animalID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// Function to display the details of the animal when the name is clicked
function clickAnimalName(mainDiv) {
  let cards = mainDiv.querySelectorAll(".card");
  cards.forEach((card) => {
    let cardbody = card.lastElementChild;
    card.firstElementChild.addEventListener("click", () => {
      cardbody.style.top = "0";
    });
    card.addEventListener("mouseleave", () => {
      cardbody.style.top = "-100%";
    });
  });
}
//function that resets the vote count of an animal
function voteReseter(animalID) {
  fetch(`https://pet-heaven-server.onrender.com/characters/${animalID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      votes: 0,
    }),
  });
} // Function to increase the vote count when the vote button is clicked
function IncreaseVoteCount(animalID, animalVotes, btn) {
  fetch(`https://pet-heaven-server.onrender.com/characters/${animalID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      votes: animalVotes + 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      btn.setAttribute("data-animal-votes", data.votes);
      btn.textContent = `Votes: ${data.votes}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function FetchAllData() {
  fetch("https://pet-heaven-server.onrender.com/characters")
    .then((res) => {
      if (res.ok) {
        console.log("HTTP request SUCCESSFUL");
      } else {
        console.log("HTTP request NOT SUCCESSFUL");
      }
      return res.json();
    })
    .then((data) => renderCard(data))
    .catch((error) => console.log(error));
}

FetchAllData();
