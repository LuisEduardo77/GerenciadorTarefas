package com.example.GerenciadorTarefas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.GerenciadorTarefas.model.Tarefa;
import com.example.GerenciadorTarefas.service.TarefaService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/tarefas")
public class TarefaController {
    @Autowired
    private TarefaService service;

    @GetMapping
    public List<Tarefa> listar(){
        return service.findAll();
    }

    @PostMapping
    public Tarefa criar(@RequestBody Tarefa tarefa){
        return service.save(tarefa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> update(@PathVariable Long id, @RequestBody Tarefa dadosAtualizados) {

    Tarefa atualizada = service.update(id, dadosAtualizados);

    return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
